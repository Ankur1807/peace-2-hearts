
import { type Toast } from "@/hooks/use-toast";

export type ToastFunction = (props: Toast) => void;

export interface ServiceEditingState {
  editMode: string | null;
  editedPrice: string;
  setEditedPrice: (price: string) => void;
}
