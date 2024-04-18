import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingSpinner from "@/components/ui/spinner";

import { useBookmarkLists } from "@hoarder/shared-react/hooks/lists";

export function BookmarkListSelector({
  value,
  onChange,
  hideSubtreeOf,
  placeholder = "Select a list",
}: {
  value?: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  hideSubtreeOf?: string;
}) {
  const { data, isPending: isFetchingListsPending } = useBookmarkLists();
  let { allPaths } = data ?? {};

  if (isFetchingListsPending) {
    return <LoadingSpinner />;
  }

  allPaths = allPaths?.filter((path) => {
    if (!hideSubtreeOf) {
      return true;
    }
    return !path.map((p) => p.id).includes(hideSubtreeOf);
  });

  return (
    <Select onValueChange={onChange} value={value ?? undefined}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {allPaths?.map((path) => {
            const l = path[path.length - 1];
            const name = path.map((p) => `${p.icon} ${p.name}`).join(" / ");
            return (
              <SelectItem key={l.id} value={l.id}>
                {name}
              </SelectItem>
            );
          })}
          {allPaths && allPaths.length == 0 && (
            <SelectItem value="nolist" disabled>
              You don&apos;t currently have any lists.
            </SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
