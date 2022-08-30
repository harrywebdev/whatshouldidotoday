import { Link } from "@remix-run/react"

export default function TodosNewRoute() {
  return (
    <>
      <header>
        <h2>Add New TODO</h2>
        <nav>
          <Link to="/todos" title="Back to TODOs" aria-label="Back to TODOs">
            Back to TODOs
          </Link>
        </nav>
      </header>
      <form method="post">
        <div>
          <label>
            Title: <input type="text" name="title" required />
          </label>
        </div>
        <div>
          <label>
            Description: <textarea name="description" />
          </label>
        </div>
        <div>
          <fieldset>
            <legend>Repeat</legend>
            <div>
              <label>
                <input type="checkbox" name="repeat" value="mo" /> Every Monday:
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" name="repeat" value="tu" /> Every
                Tuesday:
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" name="repeat" value="we" /> Every
                Wednesday:
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" name="repeat" value="th" /> Every
                Thursday:
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" name="repeat" value="fr" /> Every Friday:
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" name="repeat" value="sa" /> Every
                Saturday:
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" name="repeat" value="su" /> Every Sunday:
              </label>
            </div>
          </fieldset>
        </div>
        <div>
          <label>
            Sequence: <input type="number" name="sequence" required />
          </label>
        </div>
        <div>
          <button type="submit">Create new TODO</button>
        </div>
      </form>
    </>
  )
}
