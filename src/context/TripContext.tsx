"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Trip, TripDay, TripActivity, TripHotel, TripFlight } from "@/lib/types";

interface TripContextType {
  trips: Trip[];
  activeTrip: Trip | null;
  createTrip: (name: string, destination: string, travelers?: number) => Trip;
  deleteTrip: (id: string) => void;
  setActiveTrip: (id: string | null) => void;
  updateTrip: (id: string, updates: Partial<Pick<Trip, "name" | "destination" | "startDate" | "endDate" | "travelers">>) => void;
  addDay: (tripId: string, date?: string) => TripDay;
  removeDay: (tripId: string, dayId: string) => void;
  addActivity: (tripId: string, dayId: string, activity: Omit<TripActivity, "id">) => void;
  removeActivity: (tripId: string, dayId: string, activityId: string) => void;
  updateActivity: (tripId: string, dayId: string, activityId: string, updates: Partial<TripActivity>) => void;
  setHotel: (tripId: string, dayId: string, hotel: Omit<TripHotel, "id"> | null) => void;
  setFlight: (tripId: string, dayId: string, flight: Omit<TripFlight, "id"> | null) => void;
  getDayTotal: (day: TripDay) => number;
  getTripTotal: (trip: Trip) => number;
}

const TripContext = createContext<TripContextType | null>(null);

const TRIPS_STORAGE_KEY = "rayna_trips";
const ACTIVE_TRIP_KEY = "rayna_active_trip";

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTripId, setActiveTripId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(TRIPS_STORAGE_KEY);
      if (stored) setTrips(JSON.parse(stored));
      const activeId = localStorage.getItem(ACTIVE_TRIP_KEY);
      if (activeId) setActiveTripId(activeId);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    if (activeTripId) {
      localStorage.setItem(ACTIVE_TRIP_KEY, activeTripId);
    } else {
      localStorage.removeItem(ACTIVE_TRIP_KEY);
    }
  }, [activeTripId]);

  const activeTrip = trips.find((t) => t.id === activeTripId) ?? null;

  const updateTripInList = useCallback((id: string, updater: (trip: Trip) => Trip) => {
    setTrips((prev) => prev.map((t) => (t.id === id ? updater(t) : t)));
  }, []);

  const createTrip = useCallback((name: string, destination: string, travelers = 1): Trip => {
    const now = Date.now();
    const day: TripDay = { id: uuidv4(), dayNumber: 1, activities: [] };
    const trip: Trip = {
      id: uuidv4(),
      name,
      destination,
      travelers,
      days: [day],
      createdAt: now,
      updatedAt: now,
    };
    setTrips((prev) => [...prev, trip]);
    setActiveTripId(trip.id);
    return trip;
  }, []);

  const deleteTrip = useCallback((id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
    setActiveTripId((prev) => (prev === id ? null : prev));
  }, []);

  const setActiveTrip = useCallback((id: string | null) => {
    setActiveTripId(id);
  }, []);

  const updateTrip = useCallback((id: string, updates: Partial<Pick<Trip, "name" | "destination" | "startDate" | "endDate" | "travelers">>) => {
    updateTripInList(id, (t) => ({ ...t, ...updates, updatedAt: Date.now() }));
  }, [updateTripInList]);

  const addDay = useCallback((tripId: string, date?: string): TripDay => {
    const day: TripDay = { id: uuidv4(), dayNumber: 0, date, activities: [] };
    updateTripInList(tripId, (t) => {
      const newDays = [...t.days, { ...day, dayNumber: t.days.length + 1 }];
      return { ...t, days: newDays, updatedAt: Date.now() };
    });
    return day;
  }, [updateTripInList]);

  const removeDay = useCallback((tripId: string, dayId: string) => {
    updateTripInList(tripId, (t) => {
      const newDays = t.days
        .filter((d) => d.id !== dayId)
        .map((d, i) => ({ ...d, dayNumber: i + 1 }));
      return { ...t, days: newDays, updatedAt: Date.now() };
    });
  }, [updateTripInList]);

  const addActivity = useCallback((tripId: string, dayId: string, activity: Omit<TripActivity, "id">) => {
    updateTripInList(tripId, (t) => ({
      ...t,
      days: t.days.map((d) =>
        d.id === dayId
          ? { ...d, activities: [...d.activities, { ...activity, id: uuidv4() }] }
          : d
      ),
      updatedAt: Date.now(),
    }));
  }, [updateTripInList]);

  const removeActivity = useCallback((tripId: string, dayId: string, activityId: string) => {
    updateTripInList(tripId, (t) => ({
      ...t,
      days: t.days.map((d) =>
        d.id === dayId
          ? { ...d, activities: d.activities.filter((a) => a.id !== activityId) }
          : d
      ),
      updatedAt: Date.now(),
    }));
  }, [updateTripInList]);

  const updateActivity = useCallback((tripId: string, dayId: string, activityId: string, updates: Partial<TripActivity>) => {
    updateTripInList(tripId, (t) => ({
      ...t,
      days: t.days.map((d) =>
        d.id === dayId
          ? { ...d, activities: d.activities.map((a) => (a.id === activityId ? { ...a, ...updates } : a)) }
          : d
      ),
      updatedAt: Date.now(),
    }));
  }, [updateTripInList]);

  const setHotel = useCallback((tripId: string, dayId: string, hotel: Omit<TripHotel, "id"> | null) => {
    updateTripInList(tripId, (t) => ({
      ...t,
      days: t.days.map((d) =>
        d.id === dayId
          ? { ...d, hotel: hotel ? { ...hotel, id: uuidv4() } : undefined }
          : d
      ),
      updatedAt: Date.now(),
    }));
  }, [updateTripInList]);

  const setFlight = useCallback((tripId: string, dayId: string, flight: Omit<TripFlight, "id"> | null) => {
    updateTripInList(tripId, (t) => ({
      ...t,
      days: t.days.map((d) =>
        d.id === dayId
          ? { ...d, flight: flight ? { ...flight, id: uuidv4() } : undefined }
          : d
      ),
      updatedAt: Date.now(),
    }));
  }, [updateTripInList]);

  const getDayTotal = useCallback((day: TripDay): number => {
    const activitiesTotal = day.activities.reduce((sum, a) => sum + a.price, 0);
    const hotelTotal = day.hotel?.pricePerNight ?? 0;
    const flightTotal = day.flight?.price ?? 0;
    return activitiesTotal + hotelTotal + flightTotal;
  }, []);

  const getTripTotal = useCallback((trip: Trip): number => {
    return trip.days.reduce((sum, day) => sum + getDayTotal(day), 0);
  }, [getDayTotal]);

  return (
    <TripContext.Provider
      value={{
        trips, activeTrip, createTrip, deleteTrip, setActiveTrip, updateTrip,
        addDay, removeDay, addActivity, removeActivity, updateActivity,
        setHotel, setFlight, getDayTotal, getTripTotal,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used within TripProvider");
  return ctx;
}
