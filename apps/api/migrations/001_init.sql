--
-- PostgreSQL database dump
--

\restrict 0wPukUYhmfSTEleOQonZYXUCntY3WdgUrBkSdyqtXC4XR2W7lbcVNVrIkENujA0

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: role; Type: TYPE; Schema: public; Owner: agency_user
--

CREATE TYPE public.role AS ENUM (
    'owner',
    'developer',
    'staff'
);


ALTER TYPE public.role OWNER TO agency_user;

--
-- Name: status; Type: TYPE; Schema: public; Owner: agency_user
--

CREATE TYPE public.status AS ENUM (
    'draft',
    'pending',
    'active',
    'on_hold',
    'completed',
    'cancelled'
);


ALTER TYPE public.status OWNER TO agency_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_log; Type: TABLE; Schema: public; Owner: agency_user
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


ALTER TABLE public.activity_log OWNER TO agency_user;

--
-- Name: admin; Type: TABLE; Schema: public; Owner: agency_user
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


ALTER TABLE public.admin OWNER TO agency_user;

--
-- Name: agency; Type: TABLE; Schema: public; Owner: agency_user
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


ALTER TABLE public.agency OWNER TO agency_user;

--
-- Name: client; Type: TABLE; Schema: public; Owner: agency_user
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


ALTER TABLE public.client OWNER TO agency_user;

--
-- Name: key; Type: TABLE; Schema: public; Owner: agency_user
--

CREATE TABLE public.key (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    key_hash text CONSTRAINT key_key_not_null NOT NULL,
    key_expiry timestamp with time zone,
    email text NOT NULL,
    agency_id uuid NOT NULL,
    is_used boolean DEFAULT false
);


ALTER TABLE public.key OWNER TO agency_user;

--
-- Name: milestone; Type: TABLE; Schema: public; Owner: agency_user
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


ALTER TABLE public.milestone OWNER TO agency_user;

--
-- Name: project; Type: TABLE; Schema: public; Owner: agency_user
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


ALTER TABLE public.project OWNER TO agency_user;

--
-- Name: activity_log activity_log_pkey; Type: CONSTRAINT; Schema: public; Owner: agency_user
--

ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT activity_log_pkey PRIMARY KEY (id);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: agency_user
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- Name: agency agency_pkey; Type: CONSTRAINT; Schema: public; Owner: agency_user
--

ALTER TABLE ONLY public.agency
    ADD CONSTRAINT agency_pkey PRIMARY KEY (id);


--
-- Name: client client_pkey; Type: CONSTRAINT; Schema: public; Owner: agency_user
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_pkey PRIMARY KEY (id);


--
-- Name: key key_pkey; Type: CONSTRAINT; Schema: public; Owner: agency_user
--

ALTER TABLE ONLY public.key
    ADD CONSTRAINT key_pkey PRIMARY KEY (id);


--
-- Name: milestone milestone_pkey; Type: CONSTRAINT; Schema: public; Owner: agency_user
--

ALTER TABLE ONLY public.milestone
    ADD CONSTRAINT milestone_pkey PRIMARY KEY (id);


--
-- Name: project project_pkey; Type: CONSTRAINT; Schema: public; Owner: agency_user
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (id);


--
-- Name: activity_log fk_admin; Type: FK CONSTRAINT; Schema: public; Owner: agency_user
--

ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT fk_admin FOREIGN KEY (admin_id) REFERENCES public.admin(id);


--
-- Name: admin fk_admin_agency; Type: FK CONSTRAINT; Schema: public; Owner: agency_user
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT fk_admin_agency FOREIGN KEY (agency_id) REFERENCES public.agency(id);


--
-- Name: project fk_admin_id; Type: FK CONSTRAINT; Schema: public; Owner: agency_user
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT fk_admin_id FOREIGN KEY (admin_id) REFERENCES public.admin(id);


--
-- Name: client fk_agency_id; Type: FK CONSTRAINT; Schema: public; Owner: agency_user
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT fk_agency_id FOREIGN KEY (agency_id) REFERENCES public.agency(id);


--
-- Name: key fk_agency_id; Type: FK CONSTRAINT; Schema: public; Owner: agency_user
--

ALTER TABLE ONLY public.key
    ADD CONSTRAINT fk_agency_id FOREIGN KEY (agency_id) REFERENCES public.agency(id);


--
-- Name: project fk_client_id; Type: FK CONSTRAINT; Schema: public; Owner: agency_user
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT fk_client_id FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: project fk_project_agency; Type: FK CONSTRAINT; Schema: public; Owner: agency_user
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT fk_project_agency FOREIGN KEY (agency_id) REFERENCES public.agency(id) ON DELETE CASCADE;


--
-- Name: milestone fk_project_id; Type: FK CONSTRAINT; Schema: public; Owner: agency_user
--

ALTER TABLE ONLY public.milestone
    ADD CONSTRAINT fk_project_id FOREIGN KEY (project_id) REFERENCES public.project(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO agency_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO agency_user;


--
-- PostgreSQL database dump complete
--

\unrestrict 0wPukUYhmfSTEleOQonZYXUCntY3WdgUrBkSdyqtXC4XR2W7lbcVNVrIkENujA0

