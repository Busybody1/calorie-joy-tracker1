import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useCredits = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: credits, isLoading } = useQuery({
    queryKey: ["user-credits"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // First try to get existing credits
      const { data: existingCredits, error: fetchError } = await supabase
        .from("user_credits")
        .select("credits_remaining")
        .eq("email", user.email)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No record found, create one
          const { data: newCredits, error: insertError } = await supabase
            .from("user_credits")
            .insert({
              user_id: user.id,
              email: user.email,
              credits_remaining: 30,
              last_reset_at: new Date().toISOString()
            })
            .select("credits_remaining")
            .single();

          if (insertError) {
            console.error("Error creating credits:", insertError);
            throw insertError;
          }

          return newCredits?.credits_remaining ?? 30;
        }
        console.error("Error fetching credits:", fetchError);
        throw fetchError;
      }

      return existingCredits?.credits_remaining ?? 30;
    },
  });

  const { mutateAsync: useCredit } = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_credits")
        .update({ credits_remaining: (credits - 1) })
        .eq("email", user.email)
        .select("credits_remaining")
        .single();

      if (error) {
        console.error("Error updating credits:", error);
        throw error;
      }

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
    hasCredits: credits > 0,
  };
};