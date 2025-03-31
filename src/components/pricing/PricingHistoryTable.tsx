
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PricingHistory = {
  id: string;
  entity_id: string;
  entity_type: string;
  old_price: number | null;
  new_price: number;
  changed_by: string | null;
  created_at: string;
};

const PricingHistoryTable = () => {
  const [history, setHistory] = useState<PricingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("pricing_history")
        .select(`
          *,
          service_pricing!inner (service_name, service_id),
          package_pricing!inner (package_name, package_id)
        `)
        .order("created_at", { ascending: false });
      
      if (filter !== "all") {
        query = query.eq("entity_type", filter);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      setHistory(data || []);
    } catch (error: any) {
      console.error("Error fetching pricing history:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load pricing history",
        variant: "destructive",
      });
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  const getEntityName = (item: any) => {
    if (item.entity_type === "service" && item.service_pricing) {
      return item.service_pricing.service_name;
    } else if (item.entity_type === "package" && item.package_pricing) {
      return item.package_pricing.package_name;
    }
    return "Unknown";
  };

  const getEntityId = (item: any) => {
    if (item.entity_type === "service" && item.service_pricing) {
      return item.service_pricing.service_id;
    } else if (item.entity_type === "package" && item.package_pricing) {
      return item.package_pricing.package_id;
    }
    return "Unknown";
  };

  const filteredHistory = history.filter(item => {
    const entityName = getEntityName(item);
    const entityId = getEntityId(item);
    
    return (
      entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entityId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return <div className="text-center p-8">Loading pricing history...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-2xl font-semibold">Pricing History</h2>
        
        <div className="flex flex-col md:flex-row gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="service">Services</SelectItem>
              <SelectItem value="package">Packages</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Old Price</TableHead>
            <TableHead>New Price</TableHead>
            <TableHead>Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredHistory.length > 0 ? (
            filteredHistory.map(item => (
              <TableRow key={item.id}>
                <TableCell>{format(new Date(item.created_at), "PPP p")}</TableCell>
                <TableCell className="capitalize">{item.entity_type}</TableCell>
                <TableCell>{getEntityName(item)}</TableCell>
                <TableCell>{getEntityId(item)}</TableCell>
                <TableCell>{item.old_price ? `₹${item.old_price}` : "N/A"}</TableCell>
                <TableCell>{`₹${item.new_price}`}</TableCell>
                <TableCell>
                  {item.old_price ? (
                    <span className={`font-medium ${item.new_price > item.old_price ? 'text-green-600' : 'text-red-600'}`}>
                      {item.new_price > item.old_price ? '+' : ''}
                      {((item.new_price - item.old_price) / item.old_price * 100).toFixed(1)}%
                      {` (₹${(item.new_price - item.old_price).toFixed(2)})`}
                    </span>
                  ) : (
                    "Initial price"
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                {searchTerm
                  ? "No matching price changes found. Try a different search term."
                  : "No price change history available yet."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PricingHistoryTable;
