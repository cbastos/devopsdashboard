export default interface EmployeeEventsRetriever {
    getEventsOf(username: string, afterDateString: string);
}
