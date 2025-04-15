-- CreateTable
CREATE TABLE "cyclists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isLogued" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "cyclists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rides" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date_registration" TIMESTAMP(3) NOT NULL,
    "end_date_registration" TIMESTAMP(3) NOT NULL,
    "start_place" TEXT NOT NULL,
    "additional_information" TEXT,
    "participants_limit" INTEGER,

    CONSTRAINT "rides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registrationRides" (
    "id" TEXT NOT NULL,
    "ride_id" TEXT NOT NULL,
    "cyclist_id" TEXT NOT NULL,
    "subscription_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registrationRides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cyclists_email_key" ON "cyclists"("email");

-- AddForeignKey
ALTER TABLE "registrationRides" ADD CONSTRAINT "registrationRides_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "rides"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrationRides" ADD CONSTRAINT "registrationRides_cyclist_id_fkey" FOREIGN KEY ("cyclist_id") REFERENCES "cyclists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
