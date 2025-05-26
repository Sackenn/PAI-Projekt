import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export function FilterBar() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOption, setSortOption] = useState("created");

  const filterOptions = [
    { value: "all", label: "All Cards" },
    { value: "assigned", label: "Assigned to me" },
    { value: "due", label: "Due soon" },
  ];

  const sortOptions = [
    { value: "created", label: "Date created" },
    { value: "updated", label: "Last updated" },
    { value: "due", label: "Due date" },
    { value: "priority", label: "Priority" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white rounded-lg shadow-sm">
      <Button variant="outline" size="sm" className="flex items-center space-x-2">
        <Filter className="h-4 w-4" />
        <span>Filter</span>
      </Button>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Show:</span>
        <div className="flex items-center space-x-2">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={activeFilter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(option.value)}
              className={
                activeFilter === option.value
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center space-x-2 ml-auto">
        <span className="text-sm text-gray-600">Sort by:</span>
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
