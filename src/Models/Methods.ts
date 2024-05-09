import mongoose, { Schema, Document, Types, PopulatedDoc } from "mongoose";
import { IMethodEOQ } from "./MethodEOQ";
import { IMethodCMC } from "./MethodCMC";

const methodType = {
  NTC: "",
  EOQ: "EOQ",
  CMC: "CMC",
  RI: "RI"

} as const

export type MethodType = typeof methodType[keyof typeof methodType]

export interface IMethods extends Document {
  methodType: MethodType
  project: Types.ObjectId
  methodEOQ: PopulatedDoc<IMethodEOQ & Document>[]
  methodCMC: PopulatedDoc<IMethodCMC & Document>[]
}

const methodSchema: Schema = new Schema ({
  methodType: {
    type: String,
    enum: Object.values(methodType),
    default: methodType.NTC
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

const Method = mongoose.model<IMethods>('Method', methodSchema)
export default Method
