public class Card {
    private String id;
    private String title;
    private String desc;
    private String date;

    public Card(String id, String title, String desc, String date) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.date = date;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDesc() {
        return desc;
    }

    public String getDate() {
        return date;
    }

    @Override
    public String toString() {
        return "Card{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", desc='" + desc + '\'' +
                ", date='" + date + '\'' +
                '}';
    }
}
