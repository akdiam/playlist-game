import { PlaylistEntryProps } from "@/const/interface";

export const PlaylistEntry = (props: PlaylistEntryProps) => {
  return (
    <div className='grid grid-cols-12 w-full py-3 pl-3 items-start'>
      <div className='col-span-2 max-w-24 grid-rows-2'>
        <div className='row-span-1 text-xl mb-1'>
          {props.rank}.
        </div>
        <div className='row-span-1 text-xs font-thin'>
          <i>{props.playlist.votes} votes</i>
        </div>
      </div>
      <div className='col-span-9 flex flex-col w-auto grid-rows-2'>
        <div className='row-span-1 font-bold text-xl mb-1 truncate'>
          {props.playlist.name.length > 0 && <span>{props.playlist.name}</span>}
          {props.playlist.name.length === 0 && (<span>&empty;</span>)}
        </div>
        <div className='row-span-1 text-xs font-thin truncate'>
          <i>{`submitted by ${props.playlist.display_name} at ${props.playlist.submission_time} UTC`}</i>
        </div>
      </div>
      <div className='col-span-1 max-w-24'>
        h
      </div>
    </div>
  )
};