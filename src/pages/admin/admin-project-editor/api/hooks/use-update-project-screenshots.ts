import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProjectScreenshots } from "../update-project-screenshots";

export function useUpdateProjectScreenshots() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectScreenshots,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}