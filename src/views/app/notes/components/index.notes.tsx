import { ComponentComment } from "./comment.notes";
import { ComponentLine } from "./line.notes";
import { ComponentTransaction } from "./transaction.notes";

export default {
  line: (props: any) => <ComponentLine {...props} />,
  transaction: (props: any) => <ComponentTransaction {...props} />,
  comment: (props: any) => <ComponentComment {...props} />,
};
