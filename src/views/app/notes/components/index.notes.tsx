import { ComponentLine } from "./line.notes";
import { ComponentTransaction } from "./transaction.notes";

export default {
  line: (props: any) => <ComponentLine {...props} />,
  transaction: (props: any) => <ComponentTransaction {...props} />,
};
