--
-- PostgreSQL database dump
--

\restrict bWHYqNZp2QXNM77uAmo7lNFO7o4FqGKjfoCbOcg6BHPSon7Gbbh4trm27RtMTvc

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
    id bigint NOT NULL,
    name character varying(50) NOT NULL,
    "characterClass" character varying(255) NOT NULL,
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
    id bigint NOT NULL,
    adventurer bigint NOT NULL,
    quest bigint NOT NULL,
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
    id bigint NOT NULL,
    title character varying(100) NOT NULL,
    description character varying(500) NOT NULL,
    difficulty character varying(255) NOT NULL,
    "requiredLevel" integer NOT NULL,
    "goldReward" integer NOT NULL,
    "xpReward" integer NOT NULL,
    status character varying(255) DEFAULT 'AVAILABLE'::public.quest_status_enum NOT NULL,
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
5	Frieren	MAGE	1	0	0
6	Legolas	RANGER	1	0	0
7	Darius	WARRIOR	1	0	0
8	Reinhardt	WARRIOR	1	0	0
9	Jaina	MAGE	1	0	0
10	Sinon	RANGER	1	0	0
11	Anduin 	CLERIC	1	0	0
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
7	Kill the Lich King	The Frozen Throne stirs atop Icecrown Citadel, where the Lich King awaits to claim your soul for the Scourge. Defy the relentless hunger of Frostmourne, brave the biting cold, and strike down the master of the undead before his endless winter consumes the living. But tread carefully on the shattered ice—for there must always be a Lich King.	EPIC	80	6600	13200	AVAILABLE
8	Escort a shipement	A merchant requests an escort for a supply wagon headed to the frontier outpost. The trade route is quiet, but roadside brigands and wild beasts still threaten lone travelers. Walk alongside the cart and ensure both cargo and driver arrive intact.	MEDIUM	15	407	813	AVAILABLE
9	Kill 3 wolwes	Hungry timber wolves have wandered too close to the village outskirts, troubling livestock and travelers. Cull three of them in the nearby woods so the path remains quiet and safe for the locals.	EASY	1	10	19	AVAILABLE
10	Steal a golden egg	A prized hen nesting deep within a guarded roost lays eggs of solid gold. Slip past the sentries, snatch one of the gilded eggs, and make a clean getaway. The creature itself must remain completely unharmed—harm a single feather, and the contract is void.	HARD	40	1738	3476	AVAILABLE
11	Keep the white rabbit	A nervous patron needs someone to watch over a seemingly innocent white rabbit for the day. Do not let the soft fur fool you: the beast possesses a vicious streak a mile wide and nasty, sharp teeth that can tear through plate armor. Keep it fed, guard your neck, and try to make it to sundown in one piece.	HARD	55	2706	5412	AVAILABLE
12	Riverbank herb gathering	The village herbalist needs fresh river reeds that only grow along the southern marsh. Watch your step: aggressive snapping turtles and large mud-crabs nest in the tall reeds. Gather the plants and bring them back intact.	EASY	6	62	124	AVAILABLE
13	A feast from scraps	The elder of a struggling farming settlement insists on holding an autumn festival to draw traveling merchants, but the village coffers and larders are completely empty. Hunt wild game in the surrounding woods for the banquet, collect glowing cave moss to light the square, and secure the perimeter so scavenging beasts aren't drawn by the smell of roasting meat.	MEDIUM	12	264	528	AVAILABLE
14	The colossus of Jötunheimr	A towering frost giant has carved out a stronghold among the jagged peaks of Jötunheimr, threatening the mountain crossings. Brave the biting blizzards, strike down the chieftain in his icy courtyard, and break his clan's grip on the passes once and for all.	HARD	23	1118	2236	AVAILABLE
15	Trench vermin	The molten scorpions nesting in the lower trenches already slaughtered a rookie militia squad and reduced a nearby farming hamlet to cinders. What was an absolute massacre for low-level greenhorns is routine pest control for an experienced veteran. Head down into the charred ditch, stomp out half a dozen of the beasts, and clear the perimeter before they creep toward the main vanguard camp.	EASY	60	660	1320	AVAILABLE
16	Slayer's intern	A green-armored terror has plunged straight into Hell, ripping and tearing through demon legions with a smoking double-barreled shotgun. You are merely his frantic intern. Dodge raining gore, haul his heavy ammo crates, and survive the burning abyss by staying locked in the Doom Slayer's bloody wake.	EPIC	15	1101	2202	AVAILABLE
\.


--
-- Name: Adventurer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Adventurer_id_seq"', 11, true);


--
-- Name: Assignment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Assignment_id_seq"', 2, true);


--
-- Name: Quest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Quest_id_seq"', 16, true);


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

\unrestrict bWHYqNZp2QXNM77uAmo7lNFO7o4FqGKjfoCbOcg6BHPSon7Gbbh4trm27RtMTvc

