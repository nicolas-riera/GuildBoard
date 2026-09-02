--
-- PostgreSQL database dump
--

\restrict GSxQPXiQRtdtFG1nL3Exp9HWVKHbTiCNN4efAgKrO0eEJJ29FHpcU4RUeNGEJTz

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

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
-- Name: character_class_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.character_class_enum AS ENUM (
    'WARRIOR',
    'MAGE',
    'RANGER',
    'CLERIC'
);


ALTER TYPE public.character_class_enum OWNER TO postgres;

--
-- Name: difficulty_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.difficulty_enum AS ENUM (
    'EASY',
    'MEDIUM',
    'HARD',
    'EPIC'
);


ALTER TYPE public.difficulty_enum OWNER TO postgres;

--
-- Name: quest_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.quest_status_enum AS ENUM (
    'AVAILABLE',
    'ON_GOING',
    'COMPLETED'
);


ALTER TYPE public.quest_status_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Adventurer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Adventurer" (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    "characterClass" public.character_class_enum NOT NULL,
    level integer DEFAULT 1 NOT NULL,
    xp integer DEFAULT 0 NOT NULL,
    gold integer DEFAULT 0 NOT NULL,
    CONSTRAINT "Adventurer_gold_check" CHECK ((gold >= 0)),
    CONSTRAINT "Adventurer_level_check" CHECK ((level >= 1)),
    CONSTRAINT "Adventurer_name_check" CHECK ((length((name)::text) >= 2)),
    CONSTRAINT "Adventurer_xp_check" CHECK ((xp >= 0))
);


ALTER TABLE public."Adventurer" OWNER TO postgres;

--
-- Name: Adventurer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Adventurer_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Adventurer_id_seq" OWNER TO postgres;

--
-- Name: Adventurer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Adventurer_id_seq" OWNED BY public."Adventurer".id;


--
-- Name: Assignment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Assignment" (
    id integer NOT NULL,
    adventurer integer NOT NULL,
    quest integer NOT NULL,
    "assignedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp without time zone
);


ALTER TABLE public."Assignment" OWNER TO postgres;

--
-- Name: Assignment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Assignment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Assignment_id_seq" OWNER TO postgres;

--
-- Name: Assignment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Assignment_id_seq" OWNED BY public."Assignment".id;


--
-- Name: Quest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Quest" (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    description character varying(500) NOT NULL,
    difficulty public.difficulty_enum NOT NULL,
    "requiredLevel" integer NOT NULL,
    "goldReward" integer NOT NULL,
    "xpReward" integer NOT NULL,
    status public.quest_status_enum DEFAULT 'AVAILABLE'::public.quest_status_enum NOT NULL,
    CONSTRAINT "Quest_description_check" CHECK ((length((description)::text) >= 10)),
    CONSTRAINT "Quest_goldReward_check" CHECK (("goldReward" >= 0)),
    CONSTRAINT "Quest_requiredLevel_check" CHECK (("requiredLevel" >= 1)),
    CONSTRAINT "Quest_title_check" CHECK ((length((title)::text) >= 5)),
    CONSTRAINT "Quest_xpReward_check" CHECK (("xpReward" > 0))
);


ALTER TABLE public."Quest" OWNER TO postgres;

--
-- Name: Quest_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Quest_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Quest_id_seq" OWNER TO postgres;

--
-- Name: Quest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Quest_id_seq" OWNED BY public."Quest".id;


--
-- Name: Adventurer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Adventurer" ALTER COLUMN id SET DEFAULT nextval('public."Adventurer_id_seq"'::regclass);


--
-- Name: Assignment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Assignment" ALTER COLUMN id SET DEFAULT nextval('public."Assignment_id_seq"'::regclass);


--
-- Name: Quest id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quest" ALTER COLUMN id SET DEFAULT nextval('public."Quest_id_seq"'::regclass);


--
-- Data for Name: Adventurer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Adventurer" (id, name, "characterClass", level, xp, gold) FROM stdin;
\.


--
-- Data for Name: Assignment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Assignment" (id, adventurer, quest, "assignedAt", "completedAt") FROM stdin;
\.


--
-- Data for Name: Quest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Quest" (id, title, description, difficulty, "requiredLevel", "goldReward", "xpReward", status) FROM stdin;
\.


--
-- Name: Adventurer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Adventurer_id_seq"', 1, false);


--
-- Name: Assignment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Assignment_id_seq"', 1, false);


--
-- Name: Quest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Quest_id_seq"', 1, false);


--
-- Name: Adventurer Adventurer_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Adventurer"
    ADD CONSTRAINT "Adventurer_name_key" UNIQUE (name);


--
-- Name: Adventurer Adventurer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Adventurer"
    ADD CONSTRAINT "Adventurer_pkey" PRIMARY KEY (id);


--
-- Name: Assignment Assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_pkey" PRIMARY KEY (id);


--
-- Name: Quest Quest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quest"
    ADD CONSTRAINT "Quest_pkey" PRIMARY KEY (id);


--
-- Name: Quest Quest_title_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quest"
    ADD CONSTRAINT "Quest_title_key" UNIQUE (title);


--
-- Name: Assignment Assignment_adventurer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_adventurer_fkey" FOREIGN KEY (adventurer) REFERENCES public."Adventurer"(id) ON DELETE CASCADE;


--
-- Name: Assignment Assignment_quest_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_quest_fkey" FOREIGN KEY (quest) REFERENCES public."Quest"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict GSxQPXiQRtdtFG1nL3Exp9HWVKHbTiCNN4efAgKrO0eEJJ29FHpcU4RUeNGEJTz

