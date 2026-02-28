const LogoutButton = () => {

  return (
    <button
      onClick={() => window.localStorage.removeItem('loggedNoteappUser')}
    >logout</button>
  )
}

export default LogoutButton 