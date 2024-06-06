import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { IMethods } from "./Methods";
import { IUser } from "./Users";

export interface IProjects extends Document {
  projectName: string;
  clientName: string;
  description: string;
  methods: PopulatedDoc<IMethods & Document>[];
  manager: PopulatedDoc<IUser & Document>;
}

const projectSchema: Schema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    methods: [
      {
        type: Types.ObjectId,
        ref: "Methods",
      },
    ],
    manager: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Project = mongoose.model<IProjects>("Project", projectSchema);
export default Project;
