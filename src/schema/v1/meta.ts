import { listToColumn } from "../../universe/v1/library/helper";

const CollectionsList = [
    "user",
    "role",
    "member",
    "community"
] as const;
export const collections = listToColumn(CollectionsList)

export default collections;