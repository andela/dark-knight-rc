import { Mongo } from "meteor/mongo";
import * as Schemas from "./schemas";

export const Reviews = new Mongo.Collection("Reviews");
Reviews.attachSchema(Schemas.Review);
