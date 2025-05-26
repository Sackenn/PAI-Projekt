import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { KanbanList } from "./kanban-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { handleDrop, allowDrop, dragLeave } from "@/lib/dnd";
import { Plus } from "lucide-react";
import type { List, Card } from "@shared/schema";

interface KanbanBoardProps {
  boardId: number;
  lists: (List & { cards: Card[] })[];
}

export function KanbanBoard({ boardId, lists }: KanbanBoardProps) {
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createList = useMutation({
    mutationFn: async (data: { title: string; boardId: number; position: number }) => {
      const response = await apiRequest("POST", "/api/lists", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boards", boardId] });
      setIsAddingList(false);
      setNewListTitle("");
      toast({
        title: "List Created",
        description: "New list has been added to the board.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create List",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const moveCard = useMutation({
    mutationFn: async (data: { cardId: number; listId: number; position: number }) => {
      const response = await apiRequest("PUT", `/api/cards/${data.cardId}/move`, {
        listId: data.listId,
        position: data.position,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boards", boardId] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Move Card",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    
    createList.mutate({
      title: newListTitle,
      boardId,
      position: lists.length,
    });
  };

  const handleListDrop = (e: React.DragEvent, targetListId: number) => {
    const dragData = handleDrop(e);
    if (!dragData || dragData.type !== "card") return;

    const targetList = lists.find(l => l.id === targetListId);
    if (!targetList) return;

    // Calculate new position (add to end of target list)
    const newPosition = targetList.cards.length;

    moveCard.mutate({
      cardId: dragData.id,
      listId: targetListId,
      position: newPosition,
    });
  };

  return (
    <div className="flex space-x-6 overflow-x-auto pb-6">
      {lists.map((list) => (
        <div
          key={list.id}
          onDrop={(e) => handleListDrop(e, list.id)}
          onDragOver={allowDrop}
          onDragLeave={dragLeave}
        >
          <KanbanList list={list} boardId={boardId} />
        </div>
      ))}
      
      {/* Add List */}
      <div className="flex-shrink-0 w-80">
        {isAddingList ? (
          <div className="bg-gray-200 rounded-lg p-3">
            <form onSubmit={handleCreateList} className="space-y-3">
              <Input
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="Enter list title..."
                autoFocus
                className="bg-white"
              />
              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={createList.isPending || !newListTitle.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createList.isPending ? "Adding..." : "Add List"}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setIsAddingList(false);
                    setNewListTitle("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <Button
            onClick={() => setIsAddingList(true)}
            variant="outline"
            className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-blue-400 text-gray-600 hover:text-blue-600 bg-white/50 hover:bg-white/70"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add another list
          </Button>
        )}
      </div>
    </div>
  );
}
