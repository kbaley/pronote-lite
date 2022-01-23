import moment from 'moment';

const Timetable  = ({timetable, offset}) => {
  return (
    <table>
      <tbody>
      {timetable.map((entry) => (
        <tr key={entry.id}>
          <td>{moment(entry.from).add(offset, 'minutes').format('MMM DD HH:mm')}</td>
          <td>{entry.subject}</td>
          <td>{entry.teacher}</td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}

export default Timetable;
