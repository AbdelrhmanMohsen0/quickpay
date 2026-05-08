import { useState, useMemo } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { toast } from "sonner";

export function EditProfilePage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [loading, setLoading] = useState(false);

  const hasChanges = useMemo(() => {
    return firstName !== user?.firstName || lastName !== user?.lastName;
  }, [firstName, lastName, user]);

  const handleSave = async () => {
    if (!hasChanges) return;

    try {
      setLoading(true);
      await api.patch("/users/me/name", {
        firstName,
        lastName,
      });
      await refreshUser();
      toast.success("Profile updated successfully");
      navigate("/profile");
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30 md:mx-auto md:max-w-md md:border-x md:shadow-sm">
      {/* Header */}
      <div className="flex items-center p-4 bg-background border-b sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-lg font-semibold">Edit Profile</h1>
      </div>

      <div className="flex-1 flex flex-col p-6 space-y-8 bg-background">
        <div className="flex flex-col items-center justify-center">
          <div className="flex size-32 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 ring-4 ring-primary/5">
            <User className="size-16" />
          </div>
        </div>

        <div className="space-y-4 max-w-md mx-auto w-full">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={user?.phoneNumber || ""}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 bg-background border-t mt-auto sticky bottom-0">
        <Button
          className="w-full h-12 text-base font-semibold cursor-pointer"
          disabled={!hasChanges || loading || !firstName || !lastName}
          onClick={handleSave}
        >
          {loading ? <Loader2 className="size-5 animate-spin" /> : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
