import moment from 'moment';

const Homework  = ({homework}) => {
  return (
    <table>
      <tbody>
      {homework.map((entry) => (
        <tr key={entry.id}>
          <td>{moment(entry.for).format('ddd, MMM DD')}</td>
          <td>{entry.subject}</td>
          <td style={{width: "450px"}}>{entry.description}</td>
          <td>{entry.done ? "Done" : ""}</td>
          <td>
            {entry.files.map( (file, i ) => (
              <div key={file.id}>
                <a href={file.url} target="_blank" rel="noreferrer">File {i+1}</a>
              </div>
            ))}
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}

export default Homework;
