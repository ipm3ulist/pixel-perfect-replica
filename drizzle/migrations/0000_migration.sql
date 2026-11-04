CREATE TYPE public.lead_status AS ENUM ('new','in_review','qualified','sent_to_partner','sold','rejected','spam');

CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  object text NOT NULL CHECK (object IN ('kvartira','dom')),
  work text NOT NULL CHECK (work IN ('remont','otdelka','stroitelstvo','inzhenernye','krovlya','drugoe')),
  city text NOT NULL CHECK (char_length(city) BETWEEN 2 AND 80),
  timing text NOT NULL DEFAULT '' CHECK (char_length(timing) <= 80),
  description text NOT NULL CHECK (char_length(description) BETWEEN 10 AND 2000),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  contact text NOT NULL CHECK (char_length(contact) BETWEEN 5 AND 120),
  params jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (pg_column_size(params) < 4000),
  source_path text NOT NULL DEFAULT '' CHECK (char_length(source_path) <= 300),
  referrer text NOT NULL DEFAULT '' CHECK (char_length(referrer) <= 500),
  utm jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (pg_column_size(utm) < 2000),
  consent_processing boolean NOT NULL CHECK (consent_processing),
  consent_share boolean NOT NULL DEFAULT false,
  consent_version text NOT NULL CHECK (char_length(consent_version) <= 40),
  status public.lead_status NOT NULL DEFAULT 'new',
  partner_id text,
  crm_external_id text,
  notes text
);

GRANT INSERT ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can submit new leads"
ON public.leads FOR INSERT TO anon, authenticated
WITH CHECK (status = 'new' AND partner_id IS NULL AND crm_external_id IS NULL AND notes IS NULL);

CREATE INDEX leads_status_created_idx ON public.leads (status, created_at DESC);
CREATE INDEX leads_contact_created_idx ON public.leads (contact, created_at DESC);

-- Антиспам: не более 3 заявок с одного контакта за 10 минут.
CREATE OR REPLACE FUNCTION public.leads_rate_limit()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF (SELECT count(*) FROM public.leads
      WHERE contact = NEW.contact AND created_at > now() - interval '10 minutes') >= 3 THEN
    RAISE EXCEPTION 'rate_limited';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER leads_rate_limit BEFORE INSERT ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.leads_rate_limit();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER leads_touch BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();