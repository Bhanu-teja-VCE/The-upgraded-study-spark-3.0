import { useToast } from "@/hooks/use-toast";

// Mock types since @shared/routes is missing/broken in this env
type InsertSubscriber = { email: string };

export function useCreateSubscriber() {
  const { toast } = useToast();

  return {
    mutate: async (data: InsertSubscriber) => {
      console.log("Mock subscription:", data);
      toast({
        title: "Welcome aboard! 🚀",
        description: "You've been added to the waitlist (Mock).",
        variant: "default",
      });
    },
    isPending: false
  } as any;
}
