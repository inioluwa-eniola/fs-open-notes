import { useState, useEffect, useRef } from "react";
import Note from "./components/Note";
import Togglable from "./components/Togglable";
import Notification from './components/Notification'
import Footer from './components/Footer'
import NoteForm from "./components/NoteForm";
import LoginForm from "./components/LoginForm";
import LogoutButton from "./components/LogoutButton";
import noteService from "./services/notes";
import loginService from './services/login'

const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const noteFormRef = useRef()


  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  useEffect(() => {
    const getInitialNotes = async () => {
      try {
        const response = await noteService.getAll()
        setNotes(response)
      } catch (error) {
        console.error('GET /api/notes failed', error)
      }
    }
    getInitialNotes()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const toggleImportanceOf = (id) => {
    const note = notes.find((note) => note.id === id);
    if(!note) return 

    const changedNote = { ...note, important: !note.important };

    noteService.update(id, changedNote).then((returnedNote) => {
        setNotes(notes.map((note) => (note.id === id ? returnedNote : note)));
      })
      .catch(() => {
        setErrorMessage(`Note ${note.content} was already removed from the server`)
        setTimeout(() => {setErrorMessage(null)}, 5000)
        setNotes(notes.filter((note) => note.id !== id));
      });
  };

  const createNote = async (noteObject) => {
    noteFormRef.current.toggleVisibility()
    const returnedNote = await noteService.create(noteObject)
    setNotes(notes.concat(returnedNote))
    console.log(returnedNote)
  };

  const createLogin = async (loginInfo) => {
    try {
      const user = await loginService.login (loginInfo)
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      noteService.setToken(user.token)
      setUser(user)
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/> 
      {!user && 
        <Togglable buttonLabel='login'>
          <LoginForm createLogin={createLogin} />
        </Togglable>
      }
      {user && (
        <div>
          <div className='login-text'>
            <p>{user.name} logged in</p>
            <LogoutButton/>
          </div>
          <Togglable buttonLabel='create note' ref={noteFormRef}>
            <NoteForm createNote={createNote}/>
          </Togglable>
        </div>
        )}

      <div>
        {user && notes.length > 0 ? <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button> : null}
      </div>
      
      <ul>
        {user && notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <Footer />
    </div>
  );
};

export default App;


/**
 * Exercises
 * - App.jsx file is too large, separate the functions to their modules 
 * - logout functionality 
 */
