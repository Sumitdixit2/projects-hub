--
-- PostgreSQL database dump
--
-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3
--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.role AS ENUM (
    'owner',
    'developer',
    'staff'
);


--
-- Name: status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.status AS ENUM (
    'draft',
    'pending',
    'active',
    'on_hold',
    'completed',
    'cancelled'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_log (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    admin_id uuid NOT NULL,
    entity_type character varying(20) NOT NULL,
    entity_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    action_type character varying(20) NOT NULL,
    agency_id uuid NOT NULL,
    action character varying(90) NOT NULL
);


--
-- Name: admin; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    agency_id uuid NOT NULL,
    fullname character varying(150) NOT NULL,
    admin_role public.role NOT NULL,
    created_at date DEFAULT now(),
    updated_at date,
    password text,
    email text,
    token_expiry timestamp with time zone,
    refreshtoken text
);


--
-- Name: agency; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.agency (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(200) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    verify_code text,
    password text NOT NULL,
    is_verified boolean DEFAULT false,
    phone text,
    website text,
    description text,
    code_expiry timestamp with time zone DEFAULT (now() + '00:10:00'::interval)
);


--
-- Name: client; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    email character varying(150) NOT NULL,
    created_at date DEFAULT now(),
    agency_id uuid NOT NULL,
    refreshtoken text,
    token_expiry timestamp with time zone,
    password text NOT NULL
);


--
-- Name: key; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.key (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    key_hash text CONSTRAINT key_key_not_null NOT NULL,
    key_expiry timestamp with time zone,
    email text NOT NULL,
    agency_id uuid NOT NULL,
    is_used boolean DEFAULT false
);


--
-- Name: milestone; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.milestone (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50) NOT NULL,
    project_id uuid NOT NULL,
    due_date date,
    created_at date DEFAULT now(),
    milestone_status public.status DEFAULT 'draft'::public.status,
    description character varying(200)
);


--
-- Name: project; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(200),
    client_id uuid NOT NULL,
    admin_id uuid NOT NULL,
    started_at date DEFAULT now(),
    deadline date,
    project_status public.status DEFAULT 'draft'::public.status,
    agency_id uuid NOT NULL
);


--
-- Name: activity_log activity_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT activity_log_pkey PRIMARY KEY (id);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- Name: agency agency_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agency
    ADD CONSTRAINT agency_pkey PRIMARY KEY (id);


--
-- Name: client client_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_pkey PRIMARY KEY (id);


--
-- Name: key key_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.key
    ADD CONSTRAINT key_pkey PRIMARY KEY (id);


--
-- Name: milestone milestone_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.milestone
    ADD CONSTRAINT milestone_pkey PRIMARY KEY (id);


--
-- Name: project project_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (id);


--
-- Name: activity_log fk_admin; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT fk_admin FOREIGN KEY (admin_id) REFERENCES public.admin(id);


--
-- Name: admin fk_admin_agency; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT fk_admin_agency FOREIGN KEY (agency_id) REFERENCES public.agency(id);


--
-- Name: project fk_admin_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT fk_admin_id FOREIGN KEY (admin_id) REFERENCES public.admin(id);


--
-- Name: client fk_agency_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT fk_agency_id FOREIGN KEY (agency_id) REFERENCES public.agency(id);


--
-- Name: key fk_agency_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.key
    ADD CONSTRAINT fk_agency_id FOREIGN KEY (agency_id) REFERENCES public.agency(id);


--
-- Name: project fk_client_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT fk_client_id FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: project fk_project_agency; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT fk_project_agency FOREIGN KEY (agency_id) REFERENCES public.agency(id) ON DELETE CASCADE;


--
-- Name: milestone fk_project_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.milestone
    ADD CONSTRAINT fk_project_id FOREIGN KEY (project_id) REFERENCES public.project(id);


--
-- PostgreSQL database dump complete
--
