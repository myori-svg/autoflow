import { Schema, model } from 'mongoose'

export type FeedbackResult = 'accurate' | 'too_long' | 'too_short'

type FeedbackDocument = {
  taskTitle: string
  estimatedHours: number
  actualResult: FeedbackResult
  createdAt: Date
}

const feedbackSchema = new Schema<FeedbackDocument>(
  {
    taskTitle: { type: String, required: true },
    estimatedHours: { type: Number, required: true },
    actualResult: { type: String, enum: ['accurate', 'too_long', 'too_short'], required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export const Feedback = model<FeedbackDocument>('Feedback', feedbackSchema)
