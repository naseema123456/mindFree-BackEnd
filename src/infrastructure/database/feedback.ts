import mongoose,{Types} from 'mongoose';
import FeedbackRecord from '../../domain/feedback';

const FeedbackSchema = new mongoose.Schema<FeedbackRecord>({
    callprovider: {
        type:mongoose.Types.ObjectId,
        ref:'user'
      },
      userId: {
        type:mongoose.Types.ObjectId,
        ref:'user'
      },
      rate: {
        type: Number,
        required: true,
      },
      review: {
        type: String,
        required: true,
      },
      amountOfCourse:{
        type:Number,
        required: true,
      }
});

const Feedback = mongoose.model<FeedbackRecord>('FEEDBACK', FeedbackSchema);

export default Feedback