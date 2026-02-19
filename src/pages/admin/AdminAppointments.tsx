import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  Clock,
  User,
  Loader2,
  Check,
  X,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  preferred_date: string;
  preferred_time: string | null;
  condition: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

export default function AdminAppointments() {
  const { admin, isLoading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate("/admin/login");
    }
  }, [admin, authLoading, navigate]);

  useEffect(() => {
    if (admin) {
      fetchAppointments();
    }
  }, [admin]);

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setAppointments(data);
    }
    setIsLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({ title: "Error updating status", variant: "destructive" });
    } else {
      toast({ title: `Appointment ${status}` });
      fetchAppointments();
    }
  };

  const deleteAppointment = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", deleteId);

    if (error) {
      toast({ title: "Error deleting appointment", variant: "destructive" });
    } else {
      toast({ title: "Appointment deleted" });
      setDeleteId(null);
      fetchAppointments();
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (filter === "all") return true;
    return a.status === filter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success/10 text-success";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-warning/10 text-warning";
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!admin) return null;

  const pendingCount = appointments.filter((a) => a.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <h1 className="text-lg font-semibold text-foreground">
              Appointments ({appointments.length})
            </h1>
          </div>
          <div className="flex gap-2">
            {["all", "pending", "confirmed", "cancelled"].map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f as typeof filter)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === "pending" && pendingCount > 0 && (
                  <span className="ml-1 bg-destructive/20 text-destructive px-1.5 py-0.5 rounded text-xs">
                    {pendingCount}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <div className="container py-8">
        {filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className={`bg-card border rounded-lg p-5 ${
                  apt.status === "pending" ? "border-warning/50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-lg">
                          {apt.name}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <a href={`tel:${apt.phone}`} className="hover:text-primary">
                              {apt.phone}
                            </a>
                          </span>
                          {apt.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <a href={`mailto:${apt.email}`} className="hover:text-primary">
                                {apt.email}
                              </a>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {formatDate(apt.preferred_date)}
                        </span>
                      </div>
                      {apt.preferred_time && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{apt.preferred_time}</span>
                        </div>
                      )}
                      {apt.condition && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Condition:</span>{" "}
                          <span className="font-medium">{apt.condition}</span>
                        </div>
                      )}
                      <div>
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </div>
                    </div>

                    {apt.message && (
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                        {apt.message}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground mt-3">
                      Submitted: {new Date(apt.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    {apt.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-success hover:bg-success/90"
                          onClick={() => updateStatus(apt.id, "confirmed")}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive border-destructive/20"
                          onClick={() => updateStatus(apt.id, "cancelled")}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                    {apt.status !== "pending" && (
                      <Select
                        value={apt.status}
                        onValueChange={(value) => updateStatus(apt.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => setDeleteId(apt.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No appointments found
            </h3>
            <p className="text-muted-foreground">
              Appointment requests will appear here
            </p>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteAppointment} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
