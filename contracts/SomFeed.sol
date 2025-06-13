// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SomFeed
 * @author Your Name
 * @notice Kontrak ini mengelola aplikasi sosial on-chain: posting, komentar, dan suka.
 */
contract SomFeed {
    address public owner;
    uint256 public postCounter;

    // Biaya untuk membuat postingan dalam WEI (0.01 STT)
    uint256 public constant POST_CREATION_FEE = 0.01 ether;

    // Struct untuk menyimpan data Postingan
    struct Post {
        uint256 id;
        address author;
        string content;
        string imageCID;
        uint256 timestamp;
        uint256 likes;
    }

    // Struct untuk menyimpan data Komentar
    struct Comment {
        address author;
        string content;
        string imageCID;
        uint256 timestamp;
    }

    // Mappings
    mapping(uint256 => Post) public posts;
    mapping(uint256 => Comment[]) public comments;
    mapping(uint256 => mapping(address => bool)) public likes; // postId => userAddress => hasLiked

    // Events
    event PostCreated(
        uint256 indexed id,
        address indexed author,
        string content,
        string imageCID,
        uint256 timestamp
    );
    event PostLiked(uint256 indexed postId, address indexed user, uint256 newLikeCount);
    event CommentAdded(
        uint256 indexed postId,
        address indexed author,
        string content,
        string imageCID,
        uint256 timestamp
    );

    // Modifier untuk membatasi akses hanya untuk pemilik kontrak
    modifier onlyOwner() {
        require(msg.sender == owner, "SomFeed: Caller is not the owner");
        _;
    }

    // Constructor untuk mengatur pemilik kontrak saat deploy
    constructor() {
        owner = msg.sender;
        postCounter = 0;
    }

    /**
     * @notice Membuat postingan baru. Membutuhkan pembayaran 0.01 STT.
     * @param _content Konten dari postingan.
     * @param _imageCID CID gambar dari IPFS (opsional, bisa string kosong).
     */
    function createPost(string memory _content, string memory _imageCID) public payable {
        require(msg.value == POST_CREATION_FEE, "SomFeed: Must send correct fee to post");
        // Memastikan setidaknya ada teks atau gambar
        require(bytes(_content).length > 0 || bytes(_imageCID).length > 0, "SomFeed: Post cannot be empty");
        
        postCounter++;
        uint256 newPostId = postCounter;

        posts[newPostId] = Post({
            id: newPostId,
            author: msg.sender,
            content: _content,
            imageCID: _imageCID,
            timestamp: block.timestamp,
            likes: 0
        });

        emit PostCreated(newPostId, msg.sender, _content, _imageCID, block.timestamp);
    }

    /**
     * @notice Menambahkan komentar ke sebuah postingan.
     * @param _postId ID dari postingan yang akan dikomentari.
     * @param _content Konten dari komentar.
     * @param _imageCID CID gambar dari IPFS (opsional, bisa string kosong).
     */
    function commentOnPost(uint256 _postId, string memory _content, string memory _imageCID) public {
        require(posts[_postId].id != 0, "SomFeed: Post does not exist");
        // Memastikan setidaknya ada teks atau gambar
        require(bytes(_content).length > 0 || bytes(_imageCID).length > 0, "SomFeed: Comment cannot be empty");

        comments[_postId].push(
            Comment({
                author: msg.sender,
                content: _content,
                imageCID: _imageCID,
                timestamp: block.timestamp
            })
        );

        emit CommentAdded(_postId, msg.sender, _content, _imageCID, block.timestamp);
    }

    /**
     * @notice Menyukai sebuah postingan. Pengguna tidak dapat menyukai postingan yang sama dua kali.
     * @param _postId ID dari postingan yang akan disukai.
     */
    function likePost(uint256 _postId) public {
        require(posts[_postId].id != 0, "SomFeed: Post does not exist");
        require(!likes[_postId][msg.sender], "SomFeed: You have already liked this post");

        posts[_postId].likes++;
        likes[_postId][msg.sender] = true;

        emit PostLiked(_postId, msg.sender, posts[_postId].likes);
    }

    /**
     * @notice Mengambil semua postingan yang ada.
     * @return Post[] Array dari semua postingan.
     */
    function getAllPosts() public view returns (Post[] memory) {
        Post[] memory allPosts = new Post[](postCounter);
        for (uint i = 1; i <= postCounter; i++) {
            allPosts[i - 1] = posts[i];
        }
        return allPosts;
    }
    
    /**
     * @notice Mengambil semua komentar untuk sebuah postingan.
     * @param _postId ID dari postingan.
     * @return Comment[] Array dari semua komentar.
     */
    function getComments(uint256 _postId) public view returns (Comment[] memory) {
        return comments[_postId];
    }
    
    /**
     * @notice Menarik saldo STT dari kontrak. Hanya bisa dipanggil oleh pemilik.
     */
    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "SomFeed: Failed to withdraw funds");
    }
}