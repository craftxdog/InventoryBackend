import mongoose, { Schema, Document, Types, PopulatedDoc } from "mongoose";
import { IMethodEOQ } from "./MethodEOQ";
import { IMethodCMC } from "./MethodCMC";

const methodType = {
  NULL: "",
  EOQ: "EOQ",
  CMC: "CMC",
  RI: "RI"

} as const

export type MethodType = typeof methodType[keyof typeof methodType]

export interface IMethods extends Document {
  title: string
  product: string
  description: string
  methodType: MethodType
  project: Types.ObjectId
  methodEOQ: PopulatedDoc<IMethodEOQ & Document>[]
  methodCMC: PopulatedDoc<IMethodCMC & Document>[]
}

const methodSchema: Schema = new Schema ({
  title: {
    type: String,
    required: true
  },
  product: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  methodType: {
    type: String,
    enum: Object.values(methodType),
    default: methodType.NULL,
    required: true
  },
  project: {
    type: Types.ObjectId,
    ref: 'Project'
  },
  methodEOQ: [{
    type: Types.ObjectId,
    ref: 'MethodEOQ'
  }],
  methodCMC: [{
    type: Types.ObjectId,
    ref: 'MethodCMC'
  }]

}, { timestamps: true })

const Methods = mongoose.model<IMethods>('Methods', methodSchema)
export default Methods
