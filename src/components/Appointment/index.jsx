import React, { Fragment } from "react";
import "./styles.scss";
import Confirm from "./confirm";
import Empty from "./empty";
import Error from "./error";
import Form from "./form";
import Header from "./header";
import Show from "./show";
import Status from "./status";
import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

// const { mode, transition, back } = useVisualMode(
//     props.interview ? SHOW : EMPTY
//   );

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(err => transition(ERROR_SAVE, true));
  };

    const editApp = () => {
    transition(EDIT);
  };

  const deleteApp = () => {
    transition(DELETE, true);
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(err => transition(ERROR_DELETE, true));
  };
  const deleteConfirm = () => {
    transition(CONFIRM);
  };


  return (
    <article className="appointment">
      <>
        <Header time={props.time} />
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SAVING && <Status message={"Saving"} />}
        {mode === DELETE && <Status message={"Deleting"} />}
        {mode === CONFIRM &&
          <Confirm
            message={"Are you sure you want to cancel your booking?"}
            onCancel={back}
            onConfirm={deleteApp}
          />
        }
        {mode === SHOW && props.interview && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            id={props.id}
            onDelete={deleteConfirm}
            onEdit={editApp}
          />
        )}
        {mode === CREATE &&
          <Form
            interviewers={props.interviewers}
            onCancel={back}
            onSave={save}
          />
        }
        {mode === EDIT &&
          <Form
            student={props.interview.student}
            interviewer={props.interview.interviewer.id}
            interviewers={props.interviewers}
            onCancel={back}
            onSave={save}
          />
        }
        {mode === ERROR_SAVE &&
          <Error
            message={"error creating booking"}
            onClose={back}
          />
        }
        {mode === ERROR_DELETE && <Error
          message={"failure to delete booking"}
          onClose={back}
        />
        }
      </>
    </article>
  );
}