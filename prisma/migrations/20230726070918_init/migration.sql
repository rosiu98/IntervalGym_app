-- CreateTable
CREATE TABLE "Workout" (
    "id" SERIAL NOT NULL,
    "workout_name" TEXT NOT NULL,
    "running" INTEGER NOT NULL,
    "rest" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workout_workout_name_key" ON "Workout"("workout_name");
