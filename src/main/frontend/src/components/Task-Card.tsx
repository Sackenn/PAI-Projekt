import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CardModal } from "./card-modal";
import { startDrag, endDrag } from "@/lib/dnd";
import { Calendar, MessageCircle, Paperclip, CheckCircle, Edit } from "lucide-react";
import type { Card } from "@shared/schema";

interface TaskCardProps {
  card: Card;
  boardId: number;
}

export function TaskCard({ card, boardId }: TaskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    startDrag(e, {
      type: "card",
      id: card.id,
      sourceListId: card.listId,
    });
  };

  const formatDueDate = (date: Date | string | null) => {
    if (!date) return null;
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (date: Date | string | null) => {
    if (!date) return false;
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj < new Date();
  };

  return (
    <>
      <div
        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
        draggable
        onDragStart={handleDragStart}
        onDragEnd={endDrag}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors flex-1">
            {card.title}
          </h4>
          <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all duration-200 p-1">
            <Edit className="h-3 w-3" />
          </button>
        </div>
        
        {card.labels && card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {card.labels.map((label, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="text-xs bg-green-100 text-green-800 hover:bg-green-200"
              >
                {label}
              </Badge>
            ))}
          </div>
        )}
        
        {card.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {card.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {card.assigneeIds && card.assigneeIds.length > 0 && (
              <div className="flex -space-x-1">
                {card.assigneeIds.slice(0, 3).map((assigneeId, index) => (
                  <div 
                    key={assigneeId}
                    className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                  >
                    {assigneeId}
                  </div>
                ))}
              </div>
            )}
            
            {card.dueDate && (
              <div className={`flex items-center space-x-1 text-xs ${
                isOverdue(card.dueDate) ? 'text-red-600' : 'text-gray-500'
              }`}>
                <Calendar className="h-3 w-3" />
                <span>{formatDueDate(card.dueDate)}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-3 w-3" />
              <span>0</span>
            </div>
            <div className="flex items-center space-x-1">
              <Paperclip className="h-3 w-3" />
              <span>0</span>
            </div>
          </div>
        </div>
      </div>

      <CardModal 
        card={card}
        boardId={boardId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
