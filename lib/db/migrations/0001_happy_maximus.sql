CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"year_level" text,
	"program_name" text,
	"description" text,
	"includes" text,
	"note" text,
	"price" text,
	"price_unit" text,
	"tutor_bird_script_url" text,
	"start_date" date,
	"category" varchar(255),
	"course_order" integer
);
