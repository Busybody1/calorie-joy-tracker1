import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useCredits = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: credits, isLoading } = useQuery({
    queryKey: ["user-credits"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_credits")
        .select("credits_remaining")
        .eq("user_id", user.user.id)
        .single();

      if (error) throw error;
      return data.credits_remaining;
    },
  });

  const { mutateAsync: useCredit } = useMutation({
    mutationFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_credits")
        .update({ credits_remaining: (credits || 0) - 1 })
        .eq("user_id", user.user.id)
        .select("credits_remaining")
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-credits"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to use credit. Please try again.",
      });
    },
  });

  return {
    credits,
    isLoading,
    useCredit,
    hasCredits: (credits || 0) > 0,
  };
};