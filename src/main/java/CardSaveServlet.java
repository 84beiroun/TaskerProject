import com.google.gson.Gson;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.*;

@WebServlet(name = "CardSaveServlet", value = "/CardSaveServlet")
public class CardSaveServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
        String json = "";
        json = br.readLine();
        Gson gson = new Gson();
        Card card = gson.fromJson(json, Card.class);
        br.close();
        try {
            String myDriver = "com.mysql.cj.jdbc.Driver";
            Class.forName(myDriver);
            Connection conn = DriverManager.getConnection
                    ("jdbc:mysql://localhost:3306/db1","user",
                            "20552055");
            Statement st0 = conn.createStatement();
            String sqlReq = "SELECT EXISTS(SELECT 1 FROM card_db WHERE id LIKE " + card.getId() + ") AS existsCheck";

          ResultSet rs0 = st0.executeQuery(sqlReq);
          rs0.next();
            if (rs0.getString("existsCheck").equals("0")) {
                String SQL_INSERT = "INSERT INTO db1.card_db(id, title, descr, date)  VALUES (?,?,?,?)";
                PreparedStatement prst = conn.prepareStatement(SQL_INSERT);
                prst.setString(1, card.getId());
                prst.setString(2, card.getTitle());
                prst.setString(3, card.getDesc());
                prst.setString(4, card.getDate());
                prst.execute();
                prst.close();
            } else {
                String SQL_INSERT = "UPDATE db1.card_db t SET t.title = ?, t.descr = ?, t.date = ? WHERE t.id = ?";
                PreparedStatement prst = conn.prepareStatement(SQL_INSERT);
                prst.setString(1, card.getTitle());
                prst.setString(2, card.getDesc());
                prst.setString(3, card.getDate());
                prst.setString(4, card.getId());
                prst.execute();
                prst.close();
            }
            String SQL_CLEAN_DUPL = "DELETE t1 FROM card_db t1\n" +
                    "INNER JOIN card_db t2\n" +
                    "WHERE t1.id = t2.id AND t1.counter<t2.counter;";
            Statement st1 = conn.createStatement();
            st1.execute(SQL_CLEAN_DUPL);
            st1.close();
            st0.close();
            conn.close();
        } catch (SQLException | ClassNotFoundException throwables) {
            throwables.printStackTrace();
        }
    }
}
