
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoadNotes, addLoadNote } from '@/lib/supabaseClient';
import { format } from 'date-fns';
import { Loader2, MessageSquarePlus } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from './ui/use-toast';

interface LoadNotesProps {
  loadId: string;
  brokerName?: string;
}

interface Note {
  id: number;
  load_id: string;
  note_text: string;
  created_at: string;
  note_type?: string;
}

const LoadNotes: React.FC<LoadNotesProps> = ({ loadId, brokerName }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newNoteId, setNewNoteId] = useState<number | null>(null);
  const newNoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loadId) {
      fetchNotes();
    }
  }, [loadId]);

  useEffect(() => {
    // Scroll to the new note when it's added
    if (newNoteId !== null && newNoteRef.current) {
      newNoteRef.current.scrollIntoView({ behavior: 'smooth' });
      
      // Highlight effect
      const timer = setTimeout(() => {
        setNewNoteId(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [newNoteId, notes]);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const notesData = await getLoadNotes(loadId);
      setNotes(notesData);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Error",
        description: "Failed to load notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await addLoadNote(loadId, newNote);
      
      // Get the new note's ID from the response
      const newNoteData = response && Array.isArray(response) && response[0];
      const newNoteWithDate = {
        ...newNoteData,
        created_at: new Date().toISOString(),
        note_text: newNote
      };
      
      // Add the new note to the list without refetching all notes
      setNotes(prev => [newNoteWithDate, ...prev]);
      setNewNoteId(newNoteData.id);
      setNewNote('');
      
      toast({
        title: "Success",
        description: "Note added successfully",
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <MessageSquarePlus className="mr-2 h-5 w-5" />
          Notes {brokerName ? `- ${brokerName}` : ''}
        </CardTitle>
        <CardDescription>
          Load {loadId} - {notes.length} notes
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmitNote} className="mb-4">
          <Textarea 
            placeholder="Add a note about this load..." 
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="mb-2"
            rows={3}
          />
          <Button 
            type="submit" 
            disabled={isSubmitting || !newNote.trim()}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Saving
              </>
            ) : "Add Note"}
          </Button>
        </form>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : notes.length > 0 ? (
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {notes.map((note) => (
              <div 
                key={note.id} 
                ref={note.id === newNoteId ? newNoteRef : undefined}
                className={`p-3 border rounded-md transition-all duration-300 ${
                  note.id === newNoteId 
                    ? 'bg-primary/10 animate-pulse border-primary/30' 
                    : 'bg-muted/20'
                }`}
              >
                <p className="text-sm text-muted-foreground mb-1">
                  {formatDate(note.created_at)}
                  {note.note_type && <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-200">{note.note_type}</span>}
                </p>
                <p className="whitespace-pre-wrap">{note.note_text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-6 text-muted-foreground">No notes for this load</p>
        )}
      </CardContent>
    </Card>
  );
};

export default LoadNotes;
