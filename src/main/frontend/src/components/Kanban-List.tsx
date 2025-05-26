import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskCard } from "./task-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, MoreHorizontal, Edit, Trash } from "lucide-react";
import type { List, Card } from "@shared/schema";

interface KanbanListProps {
  list: List & { cards: Card[] };
  boardId: number;
}

export function KanbanList({ list, boardId }: KanbanListProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCard = useMutation({
    mutationFn: async (data: { title: string; listId: number; position: number }) => {
      const response = await apiRequest("POST", "/api/cards", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boards", boardId] });
      setIsAddingCard(false);
      setNewCardTitle("");
      toast({
        title: "Card Created",
        description: "New card has been added to the list.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Card",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const updateList = useMutation({
    mutationFn: async (data: { title: string }) => {
      const response = await apiRequest("PUT", `/api/lists/${list.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boards", boardId] });
      setIsEditing(false);
      toast({
        title: "List Updated",
        description: "List title has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update List",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const deleteList = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/lists/${list.id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boards", boardId] });
      toast({
        title: "List Deleted",
        description: "List has been removed from the board.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete List",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;
    
    createCard.mutate({
      title: newCardTitle,
      listId: list.id,
      position: list.cards.length,
    });
  };

  const handleUpdateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    
    updateList.mutate({ title: editTitle });
  };

  const handleDeleteList = () => {
    if (list.cards.length > 0) {
      toast({
        title: "Cannot Delete List",
        description: "Please move or delete all cards before deleting the list.",
        variant: "destructive",
      });
      return;
    }
    
    if (confirm("Are you sure you want to delete this list?")) {
      deleteList.mutate();
    }
  };

  return (
    <div className="flex-shrink-0 w-80 bg-gray-200 rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        {isEditing ? (
          <form onSubmit={handleUpdateList} className="flex-1 mr-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={() => setIsEditing(false)}
              autoFocus
              className="font-semibold text-gray-900 bg-white"
            />
          </form>
        ) : (
          <h3 
            className="font-semibold text-gray-900 cursor-pointer flex-1"
            onClick={() => setIsEditing(true)}
          >
            {list.title}
          </h3>
        )}
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">{list.cards.length}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit List
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDeleteList}
                className="text-red-600"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="space-y-3 mb-3">
        {list.cards.map((card) => (
          <TaskCard key={card.id} card={card} boardId={boardId} />
        ))}
      </div>
      
      {isAddingCard ? (
        <div className="space-y-2">
          <form onSubmit={handleCreateCard}>
            <Input
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Enter a title for this card..."
              autoFocus
              className="bg-white"
            />
          </form>
          <div className="flex space-x-2">
            <Button 
              onClick={handleCreateCard}
              size="sm"
              disabled={createCard.isPending || !newCardTitle.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createCard.isPending ? "Adding..." : "Add Card"}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setIsAddingCard(false);
                setNewCardTitle("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsAddingCard(true)}
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:bg-gray-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a card
        </Button>
      )}
    </div>
  );
}
