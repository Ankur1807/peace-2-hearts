
import { type ToastProps as Toast } from "@/components/ui/toast";

export type ToastFunction = (props: Toast) => void;

export interface ServiceEditingState {
  editMode: string | null;
  editedPrice: string;
  setEditedPrice: (price: string) => void;
}
