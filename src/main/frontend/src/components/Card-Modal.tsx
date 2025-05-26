import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  X, AlignLeft, MessageCircle, Tag, User, Clock, Paperclip, Trash 
} from "lucide-react";
import type { Card, Comment } from "@shared/schema";

interface CardModalProps {
  card: Card;
  boardId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function CardModal({ card, boardId, isOpen, onClose }: CardModalProps) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: commentsData } = useQuery({
    queryKey: ["/api/cards", card.id, "comments"],
    enabled: isOpen,
  });

  const updateCard = useMutation({
    mutationFn: async (data: Partial<Card>) => {
      const response = await apiRequest("PUT", `/api/cards/${card.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boards", boardId] });
      toast({
        title: "Card Updated",
        description: "Card has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Card",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const deleteCard = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/cards/${card.id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boards", boardId] });
      onClose();
      toast({
        title: "Card Deleted",
        description: "Card has been removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete Card",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const addComment = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", `/api/cards/${card.id}/comments`, { content });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards", card.id, "comments"] });
      setNewComment("");
      toast({
        title: "Comment Added",
        description: "Your comment has been added.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Comment",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleSaveTitle = () => {
    if (title !== card.title) {
      updateCard.mutate({ title });
    }
  };

  const handleSaveDescription = () => {
    if (description !== (card.description || "")) {
      updateCard.mutate({ description });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment.mutate(newComment);
  };

  const handleDeleteCard = () => {
    if (confirm("Are you sure you want to delete this card?")) {
      deleteCard.mutate();
    }
  };

  const formatDueDate = (date: Date | string | null) => {
    if (!date) return "No due date";
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const comments = commentsData?.comments || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSaveTitle}
                className="text-2xl font-bold border-none p-0 focus:ring-0 focus:ring-offset-0"
              />
              <p className="text-sm text-gray-500 mt-1">
                in list <span className="font-medium">To Do</span>
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <AlignLeft className="h-5 w-5" />
                <span>Description</span>
              </h3>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleSaveDescription}
                placeholder="Add a more detailed description..."
                rows={4}
                className="resize-none"
              />
            </div>
            
            {/* Comments */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Comments</span>
              </h3>
              
              <div className="space-y-4">
                {comments.map((comment: Comment & { user: any }) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                      {comment.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {comment.user?.name || "Unknown"} • {new Date(comment.createdAt!).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                <form onSubmit={handleAddComment} className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-medium">
                    U
                  </div>
                  <div className="flex-1">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      rows={3}
                      className="resize-none"
                    />
                    <Button 
                      type="submit"
                      className="mt-2 bg-blue-600 hover:bg-blue-700"
                      disabled={addComment.isPending || !newComment.trim()}
                    >
                      {addComment.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Actions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">ACTIONS</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Tag className="h-4 w-4 mr-2" />
                  Labels
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Members
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Due Date
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attachment
                </Button>
              </div>
            </div>
            
            {/* Card Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">DETAILS</h3>
              <div className="space-y-3">
                {card.assigneeIds && card.assigneeIds.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Members</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {card.assigneeIds.map((assigneeId) => (
                        <div 
                          key={assigneeId}
                          className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium"
                        >
                          {assigneeId}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {card.labels && card.labels.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Labels</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {card.labels.map((label, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Due Date</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{formatDueDate(card.dueDate)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Danger Zone */}
            <div>
              <Button
                variant="outline"
                onClick={handleDeleteCard}
                disabled={deleteCard.isPending}
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash className="h-4 w-4 mr-2" />
                {deleteCard.isPending ? "Deleting..." : "Delete Card"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
