import { collection } from "firebase/firestore";
import { db } from "./firebase";

export default {
  documents: collection(db, "documents"),
  profiles: collection(db, "profiles"),
  responses: collection(db, "responses"),
}