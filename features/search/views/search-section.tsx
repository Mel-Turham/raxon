import { getSearchIndex } from "../api/search"
import { SearchCommand } from "../components/search-command"
import { SearchTrigger } from "../components/search-trigger"

export const SearchSection = async () => (
  <SearchCommand index={await getSearchIndex()} />
)

export const SearchTriggerFallback = () => (
  <SearchTrigger className="opacity-60" disabled />
)
