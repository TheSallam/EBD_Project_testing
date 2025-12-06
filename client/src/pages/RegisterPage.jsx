function RegisterPage() {
  return (
    <div>
      <h2>Register</h2>
      <form>
        <input placeholder="Username" /><br />
        <input placeholder="Email" /><br />
        <input placeholder="Password" type="password" /><br />
        <select>
          <option>farmer</option>
          <option>buyer</option>
        </select><br />
        <button type="button">Register (static)</button>
      </form>
    </div>
  );
}
export default RegisterPage;
