// src/types/index.ts
import type { User, GuideProfile, Booking, Review, VisitType, Role } from "@prisma/client";

export type { Role, VisitType };

export type GuideWithProfile = User & {
  guideProfile: GuideProfile | null;
};

export type GuideCard = Pick<GuideProfile, 
  | "id" | "displayName" | "avatar" | "city" | "languages"
  | "visitTypes" | "halfDayPrice" | "fullDayPrice"
  | "avgRating" | "totalReviews" | "yearsExp" | "bio"
>;

export type BookingWithDetails = Booking & {
  guide: GuideProfile & { user: Pick<User, "name" | "email"> };
  tourist: Pick<User, "name" | "email" | "avatar">;
  review: Review | null;
};

export type ReviewWithAuthor = Review & {
  author: Pick<User, "name" | "avatar">;
};

export type SearchFilters = {
  city?: string;
  language?: string;
  visitType?: VisitType;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  date?: Date;
};
