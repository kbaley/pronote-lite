import moment from 'moment';

const Timetable  = ({timetable}) => {
  return (
    <table>
      <tbody>
      {timetable.map((entry) => (
        <tr key={entry.id}>
          <td>{moment(entry.from).format('MMM DD h:mm')}</td>
          <td>{entry.subject}</td>
          <td>{entry.teacher}</td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}

export default Timetable;
