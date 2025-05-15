
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

  useEffect(() => {
    if (loadId) {
      fetchNotes();
    }
  }, [loadId]);

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
      await addLoadNote(loadId, newNote);
      setNewNote('');
      toast({
        title: "Success",
        description: "Note added successfully",
      });
      fetchNotes(); // Refresh notes
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
    <Card className="mb-6">
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
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : notes.length > 0 ? (
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {notes.map((note) => (
              <div key={note.id} className="p-3 border rounded-md bg-muted/20">
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

        <form onSubmit={handleSubmitNote} className="mt-4">
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
      </CardContent>
    </Card>
  );
};

export default LoadNotes;
