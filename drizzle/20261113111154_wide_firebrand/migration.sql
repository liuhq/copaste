CREATE TABLE `pastes` (
	`id` integer PRIMARY KEY,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`slug` text NOT NULL UNIQUE,
	`owner_id` integer NOT NULL,
	`title` text,
	`language` text,
	`content` text NOT NULL,
	`expires_at` integer,
	CONSTRAINT `fk_pastes_owner_id_users_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
	CONSTRAINT "pastes_title_length_check" CHECK("title" IS NULL OR (length("title") <= 150 AND instr("title", char(0)) = 0)),
	CONSTRAINT "pastes_content_size_check" CHECK(length(CAST("content" AS BLOB)) <= 52428800),
	CONSTRAINT "pastes_expires_at_check" CHECK("expires_at" IS NULL OR "expires_at" > "created_at")
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`oidc_issuer` text NOT NULL,
	`oidc_subject` text NOT NULL,
	`display_name` text
);
--> statement-breakpoint
CREATE INDEX `pastes_owner_created_idx` ON `pastes` (`owner_id`,`created_at`,`id`);--> statement-breakpoint
CREATE INDEX `pastes_expires_at_idx` ON `pastes` (`expires_at`) WHERE ("pastes"."expires_at" is not null);--> statement-breakpoint
CREATE UNIQUE INDEX `users_oidc_identity_idx` ON `users` (`oidc_issuer`,`oidc_subject`);