CREATE TABLE ballot(
	ballot_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	ballot_title VARCHAR (255) NOT NULL
);

CREATE TABLE candidate(
	candidate_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	candidate_name VARCHAR (255) NOT NULL
);

CREATE TABLE ballot_candidate (
	ballot_id integer NOT NULL,
 	candidate_id integer NOT NULL,
	PRIMARY KEY (ballot_id, candidate_id),
	CONSTRAINT ballot_candidate_ballot_id_fkey FOREIGN KEY (ballot_id)
		REFERENCES ballot (ballot_id) MATCH SIMPLE
		ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT ballot_candidate_candidate_id_fkey FOREIGN KEY (candidate_id)
		REFERENCES candidate (candidate_id) MATCH SIMPLE
		ON UPDATE NO ACTION ON DELETE NO ACTION
);